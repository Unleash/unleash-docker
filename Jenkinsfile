#!/usr/bin/env groovy

@Library('shared-libs@1.15') _

def dockerImage
def imageName = 'unleash-server'

pipeline {
    agent {
        node {
            label agentNodeLabel(8)
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
                    dockerImage = docker.build("registry.glintpay.com/${imageName}:${params.VERSION}")
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
                currentBuild.description = "${imageName}: <b>${params.VERSION}</b>"
            }
        }
    }
}
