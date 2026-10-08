# pyrefly: ignore [missing-import]
from flask_sqlalchemy import SQLAlchemy
import sqlite3
import os

db = SQLAlchemy()


def _migrate_schema(app):
    """
    Safely sync SQLite schema with SQLAlchemy models.
    Detects missing columns in existing tables and ADDs them.
    Safe to re-run on every startup — only alters what's missing.
    """
    db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
    if not os.path.exists(db_path):
        return  # DB doesn't exist yet, create_all will handle it

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Map of SQLAlchemy type -> SQLite type for column creation
    type_map = {
        'VARCHAR': 'TEXT',
        'STRING': 'TEXT',
        'TEXT': 'TEXT',
        'INTEGER': 'INTEGER',
        'FLOAT': 'REAL',
        'BOOLEAN': 'INTEGER',
        'DATETIME': 'TIMESTAMP',
        'DATE': 'DATE',
    }

    try:
        for table_name, table_obj in db.metadata.tables.items():
            # Check if the table exists
            cursor.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
                (table_name,)
            )
            if not cursor.fetchone():
                continue  # Table doesn't exist, create_all will make it

            # Get existing columns
            cursor.execute(f"PRAGMA table_info({table_name})")
            existing_cols = {row[1] for row in cursor.fetchall()}

            # Check each model column
            for col in table_obj.columns:
                if col.name not in existing_cols:
                    # Determine SQLite column type
                    sa_type = type(col.type).__name__.upper()
                    sqlite_type = type_map.get(sa_type, 'TEXT')

                    # Determine default
                    default_clause = ''
                    if col.default is not None and col.default.arg is not None:
                        default_val = col.default.arg
                        if callable(default_val):
                            default_clause = ''  # Can't set callable defaults in DDL
                        elif isinstance(default_val, str):
                            default_clause = f" DEFAULT '{default_val}'"
                        else:
                            default_clause = f" DEFAULT {default_val}"

                    sql = f"ALTER TABLE {table_name} ADD COLUMN {col.name} {sqlite_type}{default_clause}"
                    print(f"  [MIGRATE] {sql}")
                    cursor.execute(sql)

        conn.commit()
        print("  [OK] Database schema sync complete.")
    except Exception as e:
        print(f"  [WARN] Schema migration warning: {e}")
        conn.rollback()
    finally:
        conn.close()


def init_db(app):
    db.init_app(app)
    with app.app_context():
        _migrate_schema(app)
        db.create_all()
