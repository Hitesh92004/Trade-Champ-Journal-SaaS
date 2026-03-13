from cryptography.fernet import Fernet
import base64
import hashlib


def _derive_key(secret: str) -> bytes:
    digest = hashlib.sha256(secret.encode()).digest()
    return base64.urlsafe_b64encode(digest)


def encrypt_value(value: str, secret: str) -> str:
    return Fernet(_derive_key(secret)).encrypt(value.encode()).decode()


def decrypt_value(value: str, secret: str) -> str:
    return Fernet(_derive_key(secret)).decrypt(value.encode()).decode()
