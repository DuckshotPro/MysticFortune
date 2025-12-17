# MysticFortune Workflows

This directory contains turbo-enabled workflows for common tasks. All workflows here have `// turbo-all` annotations, meaning Gemjim will auto-run all commands without requiring approval.

## Available Workflows

### `/dev` - Start Local Development Server
Installs dependencies and starts the dev server.

### `/push` - Quick Git Push
Stages, commits, and pushes changes to GitHub. Remember to provide a commit message.

### `/build` - Build Project
Cleans and builds the project for production.

### `/status` - Project Status Check
Checks git status, Node version, and installed packages.

### `/db-migrate` - Database Migrations
Generates and applies database migrations.

## Usage

To use a workflow, simply mention it in chat:
- "run /dev" or "start dev server with /dev"
- "push my changes with /push"
- "check /status"

Gemjim will automatically execute all steps without requiring approval for each command.

## Customization

You can edit these workflow files to customize the steps for your specific needs. Make sure to keep the `// turbo-all` annotation if you want auto-execution.
