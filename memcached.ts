// import { Client } from 'memjs'
import Memcached from 'memcached'

const memcached = new Memcached(`${process.env.MEMCACHED_HOST}:11211`)

export default memcached