from constants import *
import smtplib
import time
import threading
import logging

logger = logging.getLogger(APP_NAME)

class Messenger:
    def __init__(self, volume):
        self._thread = None
        self.volume_id = volume.id

        self.email = volume.email
        if volume.email_host:
            smtp_host_split = volume.email_host.split(':')
            if len(smtp_host_split) > 1:
                self.smtp_host = smtp_host_split[0]
                try:
                    self.smtp_port = int(smtp_host_split[1])
                except TypeError:
                    self.smtp_port = None
                    logger.error('Failed to convert smtp port number in ' + \
                        'config. %r' % {
                            'volume_id': self.volume_id,
                            'smtp_port': smtp_host_split[1],
                        })
            else:
                self.smtp_host = smtp_host_split[0]
                self.smtp_port = None
        self.smtp_user = volume.email_user
        self.smtp_pass = volume.email_pass
        self.smtp_ssl = volume.email_ssl

    def _send(self, message):
        if not self.email:
            return
        message = 'From %s\r\nTo: %s\r\nSubject:%s\r\n\r\n%s' % (
            SMTP_FROM_ADDR, self.email, SMTP_SUBJECT, message)

        host = self.smtp_host or None
        port = self.smtp_port or None
        username = self.smtp_user or None
        password = self.smtp_pass or None

        logger.debug('Sending smtp message. %r' % {
            'volume_id': self.volume_id,
            'smtp_host': host,
            'smtp_port': port,
            'smtp_ssl': self.smtp_ssl,
            'smtp_user': username,
            'smtp_pass': password,
            'message': message,
        })

        try:
            if self.smtp_ssl:
                server = smtplib.SMTP_SSL(host, port)
            else:
                server = smtplib.SMTP(host, port)

            if username or password:
                server.login(username, password)
            server.sendmail(SMTP_FROM_ADDR, [self.email], message)
            server.quit()
        except:
            logger.exception('Failed to send email. %r' % {
                'volume_id': self.volume_id,
                'smtp_host': host,
                'smtp_port': port,
                'smtp_ssl': self.smtp_ssl,
                'smtp_user': username,
                'smtp_pass': password,
                'message': message,
            })

    def send(self, message):
        if self._thread:
            self._thread.join()
        self._thread = threading.Thread(target=self._send, args=(message,))
        self._thread.start()
