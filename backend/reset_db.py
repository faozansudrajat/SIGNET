from modules.database import engine, Base
import sys

def reset_database():
    print("⚠️  WARNING: This will delete the 'assets' table and all its data.")
    confirm = input("Are you sure you want to proceed? (y/n): ")
    
    if confirm.lower() == 'y':
        print("🗑️  Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        print("✨ Creating new tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database reset complete! You can now run the server.")
    else:
        print("❌ Operation cancelled.")

if __name__ == "__main__":
    reset_database()
