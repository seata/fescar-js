# base.py

#
# common functions for scripts
#

class style:
    @staticmethod
    def failed(text):
        return f'\033[91m{text}\033[0m'

    @staticmethod
    def ok(text):
        return f'\033[92m{text}\033[0m'

    @staticmethod
    def warn(text):
        return f'\033[93m{text}\033[0m'
