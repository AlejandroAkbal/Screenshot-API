import { Injectable } from '@nestjs/common'
import { availableParallelism } from 'os'
import cluster from 'node:cluster'

const numCPUs = process.env.NODE_ENV === 'production' ? availableParallelism() : 1

@Injectable()
export class AppClusterService {
	static clusterize(callback: () => void) {
		//

		if (cluster.isPrimary) {
			console.log(`Primary ${process.pid} is running`)

			for (let i = 0; i < numCPUs; i++) {
				cluster.fork()
			}

			cluster.on('exit', (worker, code, signal) => {
				console.log(`Worker ${worker.process.pid} died (code: ${code}, signal: ${signal}). Restarting...`)
				cluster.fork()
			})

			//
		} else {
			console.log(`Worker ${process.pid} started`)
			callback()
		}
	}
}
