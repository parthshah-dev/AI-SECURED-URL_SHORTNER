import json
from pathlib import Path

def main():
    graph_path = Path('graphify-out/graph.json')
    if not graph_path.exists():
        print("graph.json does not exist")
        return
        
    data = json.loads(graph_path.read_text(encoding='utf-8'))
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    
    print(f"Graph has {len(nodes)} nodes and {len(edges)} edges.")
    
    # Let's search for controllers and scan their descriptions / properties
    controllers = [n for n in nodes if 'Controller' in n.get('id', '') or 'Controller' in n.get('label', '')]
    print(f"\nFound {len(controllers)} controllers:")
    for c in controllers:
        print(f"- {c.get('id')}: {c.get('description', '')[:100]}...")
        
    # Search for dependencies or imports related to pageable or sort
    pageable_nodes = [n for n in nodes if 'Pageable' in n.get('id', '') or 'Sort' in n.get('id', '')]
    if pageable_nodes:
        print(f"\nFound Pageable/Sort related nodes:")
        for p in pageable_nodes:
            print(f"- {p.get('id')}: {p.get('description', '')[:100]}...")

if __name__ == '__main__':
    main()
