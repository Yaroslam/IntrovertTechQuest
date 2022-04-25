import fetch from "node-fetch";
import {access_token, contacts_api, main_url, task_api, task_text, task_till} from "./CONST.js";

const opt = {"with": "leads"}
const header = {"Authorization": `Bearer ${access_token}`,}


async function get_contacts(){
    var url = new URL(main_url+contacts_api);
    for (let keys in opt) { url.searchParams.append(keys, opt[keys]); }
    const response = await fetch(url, {method: 'GET', headers: header});
    if(response.status === 200){
        return response.json()
    }
    else{
        return response
    }
}

function create_task(entity_id, entity_type, till, text) {
    var opt_task = [{  "text": text, "complete_till": till, "entity_id": entity_id, "entity_type": entity_type},]
    var url = new URL(main_url + task_api);
    fetch(url, {method: 'POST', headers: header, body: JSON.stringify(opt_task)}).then(res=>res.json()).then(text=>console.log(text["_embedded"]["tasks"][0]["_links"]))

}

function valid_contacts(){
    get_contacts().then((data) => {
        if(data["_embedded"] === undefined){
            console.log("Что-то пошло не так");
        }
        else{
            var contacts = data["_embedded"]["contacts"]
            for (let i = 0; i < contacts.length; i++) {
                if(contacts[i]["_embedded"]["leads"].length === 0){
                    create_task(contacts[i]["id"], "contacts", task_till, task_text);
                }
            }
        }
    })
}

valid_contacts()


