import os

sections = ['1-fire', '2-energy', '3-structure', '4-roof', '5-staircases', '6-walls', '7-building-use', '8-connections', '9-submit']

for item in sections:
    folderNames = os.listdir(f'HSEPortal.Client\\src\\app\\features\\kbi\\{item}');
    for name in folderNames:
        f = open(f'HSEPortal.Client\\src\\tests\\kbi\\{item}\\{name}.component.spec.ts', 'x');

