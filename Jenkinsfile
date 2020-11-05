#!/usr/bin/env groovy

@Library('shared-libs@1.31') _

def dockerImage
def imageName = 'unleash-server'
def version

pipeline {
    agent {
        node {
            label agentNodeLabel(3)
        }
    }

    options {
        ansiColor('xterm')
        disableResume()
    }

    stages {
        stage('Build image') {
            steps {
                script {
                    version = sh(returnStdout: true,
                        script: """jq -r '.dependencies."${imageName}".version' package-lock.json""").trim()
                    dockerImage = docker.build("registry.glintpay.com/${imageName}:${version}")
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry('https://registry.glintpay.com', 'glint-docker-registry') {
                        dockerImage.push()
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                currentBuild.description = "${imageName}: <b>${version}</b>"
            }
        }
    }
}
