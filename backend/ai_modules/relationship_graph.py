class RelationshipGraphAI:
    """
    Module 12: Relationship Graph AI
    Constructs graph nodes and edges representing relationships between People, Land Parcels, Documents, and Applications.
    """

    def generate_graph(self, application_id, applicant_name, extracted_data):
        nodes = []
        edges = []

        # App Node
        app_node_id = f"APP_{application_id}"
        nodes.append({
            "id": app_node_id,
            "label": f"Application {application_id}",
            "type": "APPLICATION",
            "details": f"Applicant: {applicant_name or 'N/A'}"
        })

        # Primary Owner Node
        primary_owner = applicant_name or "Unknown Applicant"
        for dt, fields in extracted_data.items():
            if fields.get('owner_name'):
                primary_owner = fields['owner_name']
                break

        owner_node_id = f"PERSON_{primary_owner.replace(' ', '_')}"
        nodes.append({
            "id": owner_node_id,
            "label": primary_owner,
            "type": "PERSON",
            "details": "Claimed Landowner / Applicant"
        })

        edges.append({
            "source": app_node_id,
            "target": owner_node_id,
            "relationship": "FILED_BY"
        })

        # Land Parcel Node
        survey_no = "Unknown Survey"
        village = "Unknown Village"
        for dt, fields in extracted_data.items():
            if fields.get('survey_number'):
                survey_no = fields['survey_number']
            if fields.get('village'):
                village = fields['village']

        land_node_id = f"LAND_{survey_no.replace('/', '_')}"
        nodes.append({
            "id": land_node_id,
            "label": f"Survey {survey_no}",
            "type": "LAND_PARCEL",
            "details": f"Village: {village}"
        })

        edges.append({
            "source": owner_node_id,
            "target": land_node_id,
            "relationship": "CLAIMS_OWNERSHIP"
        })

        # Document Nodes
        for doc_type, fields in extracted_data.items():
            doc_node_id = f"DOC_{doc_type}"
            nodes.append({
                "id": doc_node_id,
                "label": doc_type.replace('_', ' '),
                "type": "DOCUMENT",
                "details": f"Doc No: {fields.get('document_number', 'N/A')}"
            })

            edges.append({
                "source": app_node_id,
                "target": doc_node_id,
                "relationship": "CONTAINS_DOCUMENT"
            })

            edges.append({
                "source": doc_node_id,
                "target": land_node_id,
                "relationship": "REFERENCES_PARCEL"
            })

        return {
            "module": "relationship_graph",
            "status": "SUCCESS",
            "confidence": 0.95,
            "graph": {
                "nodes": nodes,
                "edges": edges
            }
        }
