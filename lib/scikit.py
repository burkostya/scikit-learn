import argparse, importlib, json, sys
#from sklearn import datasets

parser = argparse.ArgumentParser(description='Runs scilit-zero server')
parser.add_argument('--module',  help='Module from sklearn')
parser.add_argument('--method', help='Method')
parser.add_argument('--field', help='Field')
args = parser.parse_args();

moduleName = 'sklearn.' + args.module
module = importlib.import_module(moduleName);
method = getattr(module, args.method)

if (moduleName == 'sklearn.datasets'):
    data = method()
    field = getattr(data, args.field)
    sys.stdout.write(json.dumps(field.tolist()))
if (moduleName == 'sklearn.svm'):
    params = json.loads(sys.stdin.readline())
    clf = method(**params)
    for item in sys.stdin:
        print(item)
