#!/usr/bin/env node

const ora = require("ora")
const chalk = require("chalk")
const fs = require("fs-extra")
const path = require("path")
const figlet = require("figlet")
const { program } = require('commander')
const inquirer = require("inquirer")
const gitClone = require("git-clone")
// 项目的模板地址
const projectList = {
	// vue2版本的模板
	"vue2": "https://github.com/yuzhongtao238910/vue2-template.git",
	// vite的模板地址
	"vite-vue3": "https://github.com/yuzhongtao238910/vite-vue3.git",
	// cli的模板地址
	"cli-vue3": "https://github.com/yuzhongtao238910/vue3-official-cli.git",
	// apple的模板地址
	"apple-vue3": "https://github.com/yuzhongtao238910/vue3-webpack.git"
}

program
	.name("fengtai-vue-cli created by apple")
	.usage("<command>")

program
	.version('v-' + require("../package.json").version)

program
	.command("create <app-name>")
	.description("创建一个新的项目")
	.action(async (name) => {
		// console.log(name)
		// console.log(__dirname, process.cwd())
		const targetPath = path.resolve(__dirname, "../", name)
		if (fs.existsSync(targetPath)) {
			// console.log("yes")
			const answer = await inquirer.prompt([
				{
					type: "confirm",
					message: "是否覆盖之前的文件夹",
					default: false,
					name: "overwrite"
				}
			])
			if (answer.overwrite) {
				fs.remove(targetPath)
				console.log(chalk.green('删除成功！！！'))
			} else {
				// 直接返回起一个新名字
				console.log(chalk.red('起一个新名字吧，重新创建新项目吧'))
				return 
			}
		}
		const res = await inquirer.prompt([
			{
				type: "list",
				message: "请问你选择vue框架的什么版本",
				name: "type",
				choices: [
					{
						name: "vue2-cli: vue2版本",
						value: "vue2"
					},
					{
						name: "vue3-cli: vue3-cli版本",
						value: "cli-vue3"
					},
					{
						name: "vue3-vite: vue3-vite版本",
						value: "vite-vue3"
					},
					{
						name: "vue3-define: vuedefine自定义webpack配置版本",
						value: "apple-vue3"
					}
				]
			}
		])
		// console.log(res)
		const spinner = ora("下载之中。。。").start()
		spinner.color = 'yellow'
		spinner.text = 'Start Loading......'
		gitClone(projectList[res.type], name, {
			// 分支的意思
			checkout: "main"
		}, function(err) {
			if (err) {
				// console.log('下载失败')
				spinner.fail("下载失败")
			} else {
				// console.log(chalk.red('成功！！！'))
				spinner.succeed("下载成功")
				fs.removeSync(path.join(targetPath, ".git"))
				console.log('Done now run:')
				// console.log(path.join(targetPath, ".git"))
				console.log(chalk.green(`\n cd ${name}`))
				console.log(chalk.green(`\n npm i`))
			}
		})
	})

program.on("--help", function() {
	console.log(figlet.textSync("FengTai!", {
		font: "Ghost",
		horizontalLayout: "default",
		verticalLayout: "default",
		width: 80,
		whitespaceBreak: true
	}))
})

program.parse(process.argv)


