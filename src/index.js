//引入commander 解析命令行参数‘
import program from 'commander'
import pkg from '../package.json'
//execa调用外部命令
import execa from 'execa'
//inquirer实现人机交互
import inquirer from 'inquirer'
//ora等待提醒
import ora from 'ora'
//步骤等待显示
import Listr from 'listr'
//chalk 控制台字体颜色
import chalk from 'chalk'
//boxen给字体加边框
import boxen from 'boxen'
//更新版本
import updateNotifier from 'update-notifier'
//字体图案
import figlet from 'figlet'

export function cli(args) {
    //检查版本
    // checkVersion();
    // console.log(boxen(chalk.yellow('I love cooking'), { padding: 2 }))
    console.log(chalk.yellow(
        figlet.textSync('Helo Ben', { horizontalLayout: 'full' })
    ));
    //显示版本号
    program.version(pkg.version, '-V,--version').usage('<command> [options]')

    //添加子命令 start
    program
        .command('start <food>')
        .option('-f,--fruit <name>', 'Fruit to be added')
        .description('Start cooking food')
        .action(function(food, option) {
            console.log(`run start command`);
            //food为子命令start 的参数
            console.log(`argument:${food}`);
            //option.fruit 为option选项的全称
            console.log(`option:fruit = ${option.fruit}`)
        });

    //添加查看npm版本号 子命令npm-v
    program
        .command('npm-v')
        .description('Display npm version')
        .action(async function() {
            const { stdout } = await execa('npm -v');
            console.log('Npm version', stdout)
        });

    //实现人机交互(type name choices message)
    program
        .command('ask')
        .description('Ask some questions')
        .action(async function(option) {
            const answers = await inquirer.prompt([{
                    type: 'input',
                    name: 'name',
                    message: 'What is your name?'
                },
                {
                    type: 'confirm',
                    name: 'isAdult',
                    message: 'Are you over 18 years old?'
                },
                {
                    type: 'checkbox',
                    name: 'favoriteFrameworks',
                    choices: ['Vue', 'React', 'Angular'],
                    message: 'What are you favorite framework?'
                },
                {
                    type: 'list',
                    name: 'favoriteLanguage',
                    choices: ['Chinese', 'English', 'Japanase'],
                    message: 'What is you favorite language?'
                }
            ]);
        });
    //等待提醒
    program
        .command('wait')
        .description('Wait 5 seconds')
        .action(async function(option) {
            const spinner = ora('Waiting 5 seconds').start();
            let count = 5;

            await new Promise(resolve => {
                let interval = setInterval(() => {
                    if (count <= 0) {
                        clearInterval(interval);
                        spinner.stop();
                        resolve();
                    } else {
                        count--;
                        spinner.color = 'yellow';
                        spinner.text = `Waiting ${count} seconds`;
                    }
                }, 1000)
            })
        })

    //步骤等待显示
    program
        .command('steps')
        .description('some steps')
        .action(async function(option) {
            const tasks = new Listr([{
                    title: 'Run step 1',
                    task: () => new Promise(resolve => {
                        setTimeout(() => resolve('1 done'), 1000)
                    })
                },
                {
                    title: 'Run step 2',
                    task: () => new Promise(resolve => {
                        setTimeout(() => resolve('2 done'), 1000)
                    })
                },
                {
                    title: 'Run step 3',
                    task: () => new Promise((resolve, reject) => {
                        setTimeout(() => reject(new Error('wrong')), 1000)
                    })
                }
            ]);
            //错误捕捉
            await tasks.run().catch(err => {
                console.error(err);
            });
        })
        //解析命令行入参
    program.parse(args)
}

//版本更新
function checkVersion() {
    const notifier = updateNotifier({ pkg, updateCheckInterval: 0 });
    if (notifier.update) {
        notifier.notify();
    }
}