import ropstenConfig from './envs/ropsten';
import stagingConfig from './envs/staging';
import mainnetConfig from './envs/mainnet';

const env = {
  ropsten: ropstenConfig,
  staging: stagingConfig,
  mainnet: mainnetConfig
};

export default env;
