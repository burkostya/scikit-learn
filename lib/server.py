import argparse, gevent, signal
import zerorpc

parser = argparse.ArgumentParser(description='Runs scilit-zero server')
parser.add_argument('--host', help='Host of server')
parser.add_argument('--port', help='Port of server')
args = parser.parse_args();

class ScikitZero(object):
    def ping(self):
        return "pong"

s = zerorpc.Server(ScikitZero())
s.bind("tcp://{}:{}".format(args.host, args.port))
gevent.signal(signal.SIGTERM, s.stop);
s.run()
