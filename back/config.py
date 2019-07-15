import os


def load_env_variables():
    """
        Load variables from config.env
    """
    basedir = os.path.abspath(os.path.dirname(__file__))
    baseconf = os.path.join(basedir, 'config.env')
    if os.path.exists(baseconf):
        print('Importing environment from .env file {}'.format(os.path.abspath(baseconf)))
        for line in open(baseconf):
            var = line.strip().split('=')
            if len(var) == 2:
                os.environ[var[0].strip()] = var[1].strip().replace("\"", "")