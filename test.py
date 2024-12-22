import json

data = '{"data":{"mode":"mode1","data":{"client":"X","contractor":"X","trainingDates":{"R":"2024-11-09","AB":"2024-11-09","PK":"2024-11-09"},"signatureDates":{"single":"2024-11-09"}}}}'

# Parsowanie stringu JSON na obiekt Python (słownik)
data_dict = json.loads(data)

# Konwersja obiektu Python z powrotem na string JSON
# x = json.dumps(data_dict, indent=4)
x=data_dict['data']['mode']
print(type(x))
