from main import app
for r in app.routes:
    if hasattr(r, 'path'):
        print(f"Path: {r.path}")
    else:
        print(f"Type: {type(r)}")
