import glob

for filename in glob.glob("src/components/*.tsx"):
    with open(filename, "r") as f:
        content = f.read()
    
    if "const { isEditing } = useAdmin();" in content:
        content = content.replace("const { isEditing } = useAdmin();", "const { isEditing, setIsEditing } = useAdmin();")
        
        with open(filename, "w") as f:
            f.write(content)

