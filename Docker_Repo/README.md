# README #

This repository is exclusive to the use of docker, it includes all miniapps except expenseTracker.

### Setup Steps 

* First, clone or download the project repository.

### 1 - Install Docker & docker-compose on linux

```
sudo apt update
sudo apt upgrade
sudo apt install lsb-release ca-certificates apt-transport-https software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt install docker-ce
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### 2 - Run The docker-compose ###

* Enter the repository root directory
* Run ``` docker-compose up --build ```

### 3 - Use the project miniapps ###

* Server - ``` http://localhost:8083 ```
* Shop - ``` http://localhost:3000 ```
* Chat - ``` http://localhost:3001 ```
* Professionals - ``` http://localhost:3002 ```
