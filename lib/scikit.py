import argparse, importlib, json, sys, pickle
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
    line = sys.stdin.readline()
    params = json.loads(line)
    clf = method(**params)
    featuresList = []
    labelList    = []
    for item in sys.stdin:
        pair = json.loads(item)
        features = pair[0]
        label    = pair[1]
        featuresList.append(features)
        labelList.append(label)
    model = clf.fit(featuresList, labelList)
    pickled = pickle.dumps(model)
    sys.stdout.write(pickled)
    #print(pickled)
