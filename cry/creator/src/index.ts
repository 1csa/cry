import program from 'commander';
import stepStart from './utils/stepStart';

export default () => {
  program.command('init').description('初始化选择！');
  program.parse(process.argv);
  stepStart();
};
