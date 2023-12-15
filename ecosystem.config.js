module.exports = {
  apps : [{
    name: 'dev-auth',
    script: './dist/main.js',
    watch: '.',
    instances: 0,
    exec_mode: "cluster"
  }],

  deploy : {
    production : {
      user : 'homechoicetech',
      host : '5925',
      ref  : 'origin/main',
      repo : 'https://github.com/homechoice-tech/HC.AUTH.SERVER.git',
      path : '~/homechoice-tech/HC.AUTH.SERVER',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
