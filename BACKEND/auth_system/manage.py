import os
import sys
from dotenv import load_dotenv 
def main():
    load_dotenv() 
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "auth_system.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
        
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    main()
