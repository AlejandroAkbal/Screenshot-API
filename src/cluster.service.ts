import { Injectable } from '@nestjs/common'
import { availableParallelism } from 'os'

// Fix for cluster import - https://stackoverflow.com/a/70320320
import * as _cluster from 'cluster'

const cluster = _cluster as unknown as _cluster.Cluster

const numCPUs = process.env.NODE_ENV === 'production' ? availableParallelism() : 1

@Injectable()
export class AppClusterService {
	static clusterize(callback: Function) {
		//

		if (cluster.isPrimary) {
			console.log(`Primary ${process.pid} is running`)

			for (let i = 0; i < numCPUs; i++) {
				cluster.fork()
			}

			cluster.on('exit', (worker, code, signal) => {
				console.log(`Worker ${worker.process.pid} died. Restarting...`)
			})

			//
		} else {
			console.log(`Worker ${process.pid} started`)
			callback()
		}
	}
}
