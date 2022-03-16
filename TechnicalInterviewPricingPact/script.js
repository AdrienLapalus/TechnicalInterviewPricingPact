const axios = require("axios");
const fs = require("fs");


async function WebScrappping(){
    await axios.get("https://medium.com/search?q=Pricing")
    .then(function(response){
        //Extract the HTML page
        getData(response.data);
        //fs.writeFileSync("Page.txt",response.data);
    })
    .catch(function(error){
        console.log(error);
    })



}

function getData(data){
    //Extract Data from the HTML
    data = data.substring(data.indexOf("{\"ROOT_QUERY"));
    data = data.substring(0,data.indexOf("</script>"));
    //fs.writeFileSync("Raw Data.json",data);
    data_JSON = JSON.parse(data);
    extractData(data_JSON);
}


function extractData(data_JSON){
    //Extract the information needed in the JSON


    var id = [];
    var publication_date = [];
    var description = [];
    let id_user;
    var author =[];
    for (var id_json in data_JSON) {       
        if(id_json.search("Post:")!=-1){
            //Extract Article's id
            id.push(data_JSON[id_json]["id"]);
            //Extract Article's date
            publication_date.push(new Date(data_JSON[id_json]["firstPublishedAt"]));
            //Extract Article's description
            description.push(data_JSON[id_json]['extendedPreviewContent({"truncationConfig":{"minimumWordLengthForTruncation":150,"previewParagraphsWordCountThreshold":400,"shortformMinimumWordLengthForTruncation":30,"shortformPreviewParagraphsWordCountThreshold":30,"showFullImageCaptions":true,"truncateAtEndOfSentence":true}})']['subtitle']);
            //Extract Article's user id
            id_user = data_JSON[id_json]['creator']['__ref'];
            //Extract Article's author
            author.push(data_JSON[id_user]['name']);


        }
    }
//console.log(id);
//console.log(publication_date);
//console.log(description);
//console.log(author);

MakeJson(id,publication_date,description,author);

}


function MakeJson(id,publication_date,description,author){
    article = [];
    //Creation of the article with Json
    for(i = 0; i < id.length; i++){
      article_data = {
        Id : id[i],
        'Publication date' : publication_date[i],
        Author : author[i],
        Description : description[i]
      }
      article.push(article_data);
    }
    //console.log(article);
    fs.writeFileSync("Data.json",JSON.stringify(article,null,'\t'));
}



WebScrappping();