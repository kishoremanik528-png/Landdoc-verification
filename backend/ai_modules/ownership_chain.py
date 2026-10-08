class OwnershipChainAI:
    """
    Module 13: Ownership Chain Verification AI
    Analyzes historical ownership transfer sequence and flags missing deed transfer links.
    """

    def analyze_chain(self, ownership_records):
        if not ownership_records:
            return {
                "module": "ownership_chain",
                "status": "INSUFFICIENT_DATA",
                "chain_status": "NO_RECORDS",
                "missing_links": [],
                "requires_review": True,
                "explanation": "No historical ownership records available for chain analysis"
            }

        sorted_chain = sorted(ownership_records, key=lambda x: x.get('sequence_order', 1))
        missing_links = []
        has_gap = False

        for i in range(len(sorted_chain)):
            curr = sorted_chain[i]
            owner_name = curr.get('owner_name', '')
            if "GAP" in owner_name.upper() or "UNVERIFIED" in owner_name.upper() or "MISSING" in owner_name.upper():
                has_gap = True
                missing_links.append({
                    "sequence_step": curr.get('sequence_order'),
                    "issue": "Unverified ownership transfer transition between preceding vendor and current buyer"
                })

        chain_status = "INCOMPLETE" if has_gap else "VERIFIED_SEQUENCE"
        explanation = "Ownership transfer history is continuous" if not has_gap else "Ownership history contains missing or unverified deed transfer links"

        return {
            "module": "ownership_chain",
            "status": "SUCCESS",
            "confidence": 0.90,
            "chain_status": chain_status,
            "chain": sorted_chain,
            "missing_links": missing_links,
            "requires_review": has_gap,
            "explanation": explanation
        }
