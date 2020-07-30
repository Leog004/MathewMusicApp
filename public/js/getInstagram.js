import axios from 'axios';

  async function instagramPhotos () {
    // It will contain our photos' links
    const res = []
    
    try {
        const userInfoSource = await axios.get('https://www.instagram.com/theraloss/')
        console.log(userInfoSource);
        // userInfoSource.data contains the HTML from Axios
        const jsonObject = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)

        const userInfo = JSON.parse(jsonObject)
        // Retrieve only the first 10 results
        const mediaArray = userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(0, 10)
        for (let media of mediaArray) {
            const node = media.node
            
            // Process only if is an image
            if ((node.__typename && node.__typename !== 'GraphImage')) {
                continue
            }

            // Push the thumbnail src in the array
            res.push(node.thumbnail_src)
        }
    } catch (e) {
        console.error('Unable to retrieve photos. Reason: ' + e.toString())
    }
    
    return res
    }

    var myImages = instagramPhotos();
    console.log(myImages);
