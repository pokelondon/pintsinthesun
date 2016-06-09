import os
from fabric.api import env, run
from fabric.state import output
from fabric.context_managers import cd

from velcro.env import bootstrap as _bootstrap
from velcro.decorators import pre_hooks, post_hooks
from velcro.http.nginx import (restart_nginx, reload_nginx, stop_nginx,
                               start_nginx)
from velcro.service.supervisord import list_programs, start, stop, restart
from velcro.scm.git import deploy as _deploy
from velcro.target import live, stage

# Silence Output
output['running'] = False

# Project Details
env.client = 'poke'
env.project = 'pints'

env.local_path = os.path.abspath(os.path.dirname(__file__))

# Paths & Directories
env.root_path = '/poke/data/www/'
env.directories = {
    'static': None, 'logs': None, 'src': None,
}

# Users
env.user = 'poke'
env.sudo_user = 'root'

# Version Control
env.scm = 'git'

# Hosts to deploy too
env.hosts = [
    'sunflora.pokedev.net'
]

# Config path
env.config_path_pipeline = [
    'src',
    '{config_dir}',
    '{target}',
]

# HTTP Server
env.http_server_conf_path = '/poke/data/conf/nginx/'
env.nginx_conf = 'nginx.conf'

# Supervisord Configs
env.supervisord_config_dir = '/poke/data/conf/supervisord/'
env.supervisord_configs = [
    'supervisord.conf',
]

@post_hooks(
    'velcro.http.nginx.symlink',
    'velcro.service.supervisord.symlink',
)
def bootstrap():
    _bootstrap()


@post_hooks(
    'velcro.scm.git.clean',
    'velcro.service.supervisord.symlink',
    'velcro.http.nginx.symlink',
    'service.supervisord.reread',
)
def deploy(branch, **kwargs):
    _deploy(branch)


def install():
    src = os.path.join(env.base_path, 'src')
    with cd(src):
        run('npm install')
