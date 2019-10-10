Make or Break
===

## Tools

```
$ npm run generate-component <name>
```

## Deploying

### Pre-requirements

The deployment process is done by copying the build files into the remote host
with `scp`, logging in as the `deploy` user. This means that the files and the
web root directory are owned by `deploy` in the remote system. As such, it's a
pre-requirement that the www-data user, which nginx runs under, needs to be a
part of the `deploy` group.

```
# usermod -aG deploy www-data
```

### SSH keys

You must be able to login with this user with ssh keys.

Generate an ssh key:
```
ssh-keygen -t ed25519 -C "covfefe@makeorbreak.io"
```

Add the public key to `/home/deploy/.ssh/authorized_keys` on the remote machine.

You can use this `.ssh/config` snippet to associate a particular ssh key with a
remote host on the local machine.

```
host makeorbreak.io
    Hostname makeorbreak.io
    User deploy
    IdentityFile ~/.ssh/id_rsa_psc
```

Test using `ssh deploy@makeorbreak.io whoami` or something.

### Deploying

```
$ npm run deploy:production
```
