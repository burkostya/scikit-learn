import argparse, gevent, signal
import zerorpc
from sklearn import datasets

parser = argparse.ArgumentParser(description='Runs scilit-zero server')
parser.add_argument('--host', help='Host of server')
parser.add_argument('--port', help='Port of server')
args = parser.parse_args();

class ScikitZero(object):
    def ping(self):
        return "pong"
    @zerorpc.stream
    def iris(self):
        return datasets.load_iris().data.tolist();
    @zerorpc.stream
    def digits(self, options):
        defaultData = 'data'
        if options['subname']:
            defaultData = options['subname']
        digits = datasets.load_digits()
        return getattr(digits, defaultData).tolist();

s = zerorpc.Server(ScikitZero())
s.bind("tcp://{}:{}".format(args.host, args.port))
gevent.signal(signal.SIGTERM, s.stop);
s.run()
