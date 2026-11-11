"""统一时间口径"""

from datetime import datetime, timezone

def utcnow() -> datetime:
    return datetime.now(timezone.utc)
