const word = document.getElementById("word")
const findbtn = document.getElementById("findbtn")

findbtn.addEventListener("click" , getDictData);

function getDictDataAPI(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    resolve(response.json()); // Return the parsed JSON data
                } else {
                    reject(`Error In Collecting Date`);
                }
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
                reject(`Error In Collecting Date`);
            });
    });
}


function getDictData() {
    const wrd = word.value;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wrd}`;
    getDictDataAPI(url)
    .then((result) => {
        return displayData(result[0])
    })
    .then((isShown) => {
        if(isShown){
            console.log("Data Displayed Successfully")
        }
    })
    .catch((error) => {
        console.log(error)
    });
}

function displayData(data) {
    const word= data.word
    const phonetic = data.phonetic
    const description = []
    const examples = []
    const synonyms = []
    const antonyms = []

    data.meanings.forEach(element => {
        element.definitions.forEach((def) => {
            description.push(def.definition)
            if(def.example!=undefined) { examples.push(def.example)}
        })

        if(element.synonyms.length){
            element.synonyms.forEach((syn) =>{
                synonyms.push(syn);
            })
        }

        if(element['antonyms'].length>0){
            element.antonyms.forEach((ant) => {
                antonyms.push(ant);
            })
        }
    
    });

    const resultTable = document.getElementById("resulttable");
    if(resultTable.style.visibility == "visible"){
        const tablecols = document.getElementById("tablebody")
        tablecols.innerHTML = ""
    }else{
        resultTable.style.visibility = "visible"
    }
   createRowWithTwoColumn("Word" , word)
   createRowWithTwoColumn("Phonetic", phonetic)
   createRowWithTwoColumn("Definitions" , description)
   createRowWithTwoColumn("Synonyms" , synonyms)
   createRowWithTwoColumn("Antonyms" , antonyms)
   createRowWithTwoColumn("Examples" , examples)

}

function createRowWithTwoColumn(key,value,keyid,keyclass,valueid,valueclass){
   
   //Creating a row
   const row = document.createElement("tr");

   //Creating 1st column
   const col1 = document.createElement("td");
   col1.innerHTML = key;
   if(!keyclass == undefined){col1.className = keyclass}
   if(!keyid == undefined){col1.id = keyid}

   //Creating 2nd column
   const col2 = document.createElement("td");

   //If 'value' is array it is displayed as a list 
   if(Array.isArray(value)){
        const ol = document.createElement("ol")
        value.forEach((ele) => {
            const li = document.createElement("li");
            li.innerHTML = ele
            ol.append(li)
       });
       col2.append(ol)
   }else{
      col2.innerHTML = value;
   }

   if(!valueclass == undefined){col2.className = valueclass}
   if(!valueid == undefined){col2.id = valueid}

   //Appeding columns to row
   row.append(col1)
   row.append(col2);

   //Appending row to table
   const tablebody = document.getElementById("tablebody")
   tablebody.append(row)
}