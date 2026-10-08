from app import create_app
app = create_app()
client = app.test_client()

for i in range(1, 6):
    key = f'scenario_{i}'
    r = client.post(f'/api/demo/scenarios/{key}/run')
    d = r.get_json()
    risk_level = d.get('risk_level', 'N/A')
    risk_score = d.get('risk_score', 'N/A')
    title = d.get('title', '')[:60]
    print(f'{key}: status={r.status_code} risk={risk_level} score={risk_score} | {title}')
