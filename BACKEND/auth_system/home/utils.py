import dns.resolver
from django.core.mail import EmailMessage
import threading

class EmailThread(threading.Thread):
    def __init__(self, email):
        super().__init__()
        self.email = email

    def run(self):
        self.email.send()

class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data['email_subject'], 
            body=data['email_body'], 
            to=[data['to_email']]
        )
        EmailThread(email).start()

def check_mx_record(domain):
    try:
        return bool(dns.resolver.resolve(domain, 'MX'))
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN):
        return False

def validate_email(email):
    try:
        domain = email.split('@')[1]
        return check_mx_record(domain)
    except IndexError:
        return False
