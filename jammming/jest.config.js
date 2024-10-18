console.log("Jest config is being loaded"); 
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./util.js'],
    verbose: true,
    silent: false,
};
  