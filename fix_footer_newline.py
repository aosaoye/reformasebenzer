with open("src/components/Footer.tsx", "r") as f:
    content = f.read()

# Let's replace the problematic area precisely
bad_part = """                                    {isEditing ? (
                                         <div className="flex flex-col gap-2 relative z-50">
                                             <textarea 
                                                 value={localData.address.replace(/<br \/>/g, '\n')}"""

# Wait, in the actual file, what does it look like? Let's check with a python print:
print("Length of content:", len(content))
target = "value={localData.address.replace"
idx = content.find(target)
if idx != -1:
    print("Found target! Content around it:")
    print(repr(content[idx-100:idx+250]))

# Let's replace the bad block using regex or direct replace
import re
new_content = re.sub(
    r'value=\{localData\.address\.replace\(/<br \\/>/g,\s*\'\n\'\)\}\s*onChange=\{\(e\) => setLocalData\(\{\.\.\.localData,\s*address:\s*e\.target\.value\.replace\(/\\n/g,\s*\'<br />\'\)\}\)\}',
    "value={localData.address.replace(/<br \/>/g, '\\n')} onChange={(e) => setLocalData({...localData, address: e.target.value.replace(/\\n/g, '<br />')})}",
    content
)

# If regex is tricky, let's do a direct replacement by finding the indices
start_idx = content.find("isEditing ? (")
# Let's find the closing of textarea
end_idx = content.find("placeholder=\"Dirección\"", start_idx)
if start_idx != -1 and end_idx != -1:
    print("Found block indices!")
    # Replace from "isEditing ? (" up to "placeholder=\"Dirección\""
    block_to_replace = content[start_idx:end_idx]
    print("Block to replace:")
    print(repr(block_to_replace))
    
    clean_block = """isEditing ? (
                                         <div className="flex flex-col gap-2 relative z-50">
                                             <textarea 
                                                 value={localData.address.replace(/<br \\/>/g, '\\n')}
                                                 onChange={(e) => setLocalData({...localData, address: e.target.value.replace(/\\n/g, '<br />')})}
                                                 className="bg-stone-200 text-stone-900 w-full p-2 text-xs rounded border border-indigo-500 focus:outline-none"
                                                 rows={3}
                                                 """
    content = content[:start_idx] + clean_block + content[end_idx:]
    with open("src/components/Footer.tsx", "w") as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Failed to find block!")

