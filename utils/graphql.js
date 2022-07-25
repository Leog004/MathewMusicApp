const {request, gql} = require('graphql-request');

const graphqlAPI = process.env.GRAPHCMSAPITOKEN;

exports.GetAllMusic = async () => {
    

    const query = gql`query GetAllMusic {
        musics(orderBy: releasedDate_DESC) {
          id
          title
          isFeaturedOnHeader
          lyrics
          musicHashTags
          albumImage {
            url
          }
          spotifyUrl
          releasedDate
          showOnWeb
          showOnHomePage
        }
      }
      `;

      const result = await request(graphqlAPI, query); // get our response from api call

      return result.musics; // return data

}

exports.GetFeaturedSong = async () => {

    const query = gql`query GetFeaturedSong {
    musics(first: 1, where: {isFeaturedOnHeader: true}) {
      id
      title
      isFeaturedOnHeader
      lyrics
      musicHashTags
      albumImage {
        url
      }
      spotifyUrl
      releasedDate
      showOnWeb
    }
  }`

  const result = await request(graphqlAPI, query); // get our response from api call

  return result.musics; // return data

}

exports.GetAllVideos = async () => {
    const query = gql`
    query GetAllVideos {
        videos {
          id
          youTubeUrl
        }
      }      
    `

    const result = await request(graphqlAPI, query); // get our response from api call  
    return result.videos; // return data
}

exports.GetBio = async () => {
    const query = gql`
    query GetBio {
        bios(first: 1) {
          bioTitle
          id
          performedAt
          radioPlay {
            title
            text
          }
          addToBio {
            text
            title
          }
        }
      }    
    `;

    const result = await request(graphqlAPI, query); // get our response from api call  
    return result.bios; // return data
}

exports.GetAbout = async () => {
    const query = gql`
    query GetAbout {
        abouts(first: 1) {
          aboutImage {
            url
          }
          aboutParagraphs
          aboutTitle
          id
          images {
            url
          }
        }
      }
       
    `;

    const result = await request(graphqlAPI, query); // get our response from api call  
    return result.abouts; // return data
}