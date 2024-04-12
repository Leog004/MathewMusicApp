/**
 * @fileoverview This file contains the controller functions responsible for handling requests
 * and rendering views for different pages. It utilizes utility functions for asynchronous
 * error handling, fetching data from GraphQL services, sending emails, and more.
 */

const catchAsync = require('./../utils/catchAsync')
const AppError = require('../utils/appError')
const Email = require('../utils/email')
const Subscriber = require('../models/subscriber')
const fetch = require('node-fetch')
const {
  GetAllMusic, GetFeaturedSong, GetAllVideos, GetBio, GetAbout,
  GetFeaturedVideos, GetMetaData, GetBanners
} = require('../utils/graphql')

/**
 * Fetches page data concurrently using provided GraphQL query functions.
 * @param {Function[]} queryFunctions - Array of functions that return promises.
 * @returns {Promise<Array>} Promise that resolves to an array of query results.
 */
async function fetchPageData (queryFunctions) {
  return await Promise.all(queryFunctions.map(func => func()))
}

/**
 * Middleware to validate email in the request body.
 * Throws an AppError if the email is missing or invalid.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 */
exports.checkBodyForEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body
  if (!email) {
    return next(new AppError('Cannot find email parameter', 404))
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return next(new AppError('Email is not valid', 404))
  }
  next()
})

/**
 * Controller function to render the home page.
 * Fetches necessary data and renders the page with dynamic content.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getHomePage = catchAsync(async (req, res) => {
  const [music, featuredSong, featuredVideo, getMetaData, getHomeBanner] = await fetchPageData([
    GetAllMusic,
    GetFeaturedSong,
    GetFeaturedVideos,
    GetMetaData,
    GetBanners
  ])

  const homeBannerImage = getHomeBanner?.homeBanner?.url || '/img/header/1.png'
  const featuredSongPlay = featuredSong.length > 0 ? featuredSong[0].spotifyUrl : 'https://open.spotify.com/embed/track/3meajb9mhHi8qIII4EHSDE'
  let showBanner = true

  if (!getMetaData?.popUpBanner?.showBanner || !getMetaData?.popUpBanner?.url || getMetaData?.popUpBanner?.bannerImage.url === '') {
    showBanner = false
  }

  
  res.status(200).render('mathew/home', {
    Title: 'Mathew Maciel - Home Page',
    music,
    featuredSong: featuredSongPlay,
    featuredVideo,
    getMetaData,
    homeBannerImage,
    showBanner
  })
})

/**
 * Controller function to render the contact page.
 * Fetches meta data and banner information then renders the page with dynamic content.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getContactPage = async (req, res) => {
  const [getMetaData, getContactBanner] = await fetchPageData([GetMetaData, GetBanners])
  const contactBannerImage = getContactBanner?.contactBanner?.url || '/img/header/7.png'

  res.status(200).render('mathew/contact', {
    Title: 'Mathew Maciel - Contact Page',
    getMetaData,
    contactBannerImage
  })
}

/**
 * Controller function to render the music page.
 * Fetches music data, meta data, and banner information then renders the page with dynamic content.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getMusicPage = catchAsync(async (req, res) => {
  const [music, getMetaData, getMusicBanner] = await fetchPageData([GetAllMusic, GetMetaData, GetBanners])
  const musicBannerImage = getMusicBanner?.musicBanner?.url || '/img/header/5.png'

  res.status(200).render('mathew/music', {
    Title: 'Mathew Maciel - Music Page',
    music,
    getMetaData,
    musicBannerImage
  })
})

/**
 * Controller function to render the videos page.
 * Fetches video data, meta data, and banner information then renders the page with dynamic content.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getVideoPage = catchAsync(async (req, res) => {
  const [videos, getMetaData, getVideoBanner] = await fetchPageData([GetAllVideos, GetMetaData, GetBanners])
  const videoBannerImage = getVideoBanner?.videoBanner?.url || '/img/header/6.png'

  res.status(200).render('mathew/videos', {
    Title: 'Mathew Maciel - Video Page',
    videos,
    getMetaData,
    videoBannerImage
  })
})

/**
 * Controller function to render the biography page.
 * Fetches biography data, meta data, and banner information then renders the page with dynamic content.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getBioPage = catchAsync(async (req, res) => {
  const [bio, getMetaData, getBioBanner] = await fetchPageData([GetBio, GetMetaData, GetBanners])
  const bioBannerImage = getBioBanner?.bioBanner?.url || '/img/header/4.png'

  res.status(200).render('mathew/bio', {
    Title: 'Mathew Maciel - Bio Page',
    bio,
    getMetaData,
    bioBannerImage
  })
})

/**
 * Controller function to render the about page.
 * Fetches about data, meta data, and banner information then renders the page with dynamic content.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getAboutPage = catchAsync(async (req, res) => {
  const [about, getMetaData, getAboutBanner] = await fetchPageData([GetAbout, GetMetaData, GetBanners])
  const aboutBannerImage = getAboutBanner?.aboutBanner?.url || '/img/header/2.png'

  res.status(200).render('mathew/about', {
    Title: 'Mathew Maciel - About Page',
    about,
    getMetaData,
    aboutBannerImage
  })
})

/**
 * Controller function to render the construction page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getConstructionPage = (req, res) => {
  const getMetaData = {
    id: 'clgrky116zpqz0bim0n2630ei',
    photoLink: { url: 'https://media.graphassets.com/TJHWac7S968pdz5X9QRL' },
    socialMedia: [
      {
        showSocialMedia: true,
        socialMediaLink: 'https://www.facebook.com/mathewmacielmusic',
        socialMediaName: 'Facebook'
      },
      {
        showSocialMedia: true,
        socialMediaLink: 'https://www.instagram.com/mathew_maciel/',
        socialMediaName: 'Instagram'
      },
      {
        showSocialMedia: true,
        socialMediaLink: 'https://twitter.com/mathew_maciel',
        socialMediaName: 'Twitter'
      },
      {
        showSocialMedia: true,
        socialMediaLink: 'https://www.youtube.com/mathewmacielmusic',
        socialMediaName: 'Youtube'
      },
      {
        showSocialMedia: true,
        socialMediaLink: 'https://www.tiktok.com/@mathewmacielmusic?_t=8aTqoqEdyN4&_r=1',
        socialMediaName: 'TikTok'
      }
    ]
  }

  res.status(200).render('mathew/construction', {
    Title: 'Mathew Maciel - Construction Page',
    getMetaData,
  })
}

/**
 * Controller function to render the login page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.login = (req, res) => {
  const getMetaData = {
    id: 'clgrky116zpqz0bim0n2630ei',
    photoLink: { url: 'https://media.graphassets.com/TJHWac7S968pdz5X9QRL' },
    socialMedia: [
      {
        showSocialMedia: true,
        socialMediaLink: 'https://www.facebook.com/mathewmacielmusic',
        socialMediaName: 'Facebook'
      },
      {
        showSocialMedia: true,
        socialMediaLink: 'https://www.instagram.com/mathew_maciel/',
        socialMediaName: 'Instagram'
      },
      {
        showSocialMedia: true,
        socialMediaLink: 'https://twitter.com/mathew_maciel',
        socialMediaName: 'Twitter'
      },
      {
        showSocialMedia: true,
        socialMediaLink: 'https://www.youtube.com/mathewmacielmusic',
        socialMediaName: 'Youtube'
      },
      {
        showSocialMedia: true,
        socialMediaLink: 'https://www.tiktok.com/@mathewmacielmusic?_t=8aTqoqEdyN4&_r=1',
        socialMediaName: 'TikTok'
      }
    ]
  }

  res.status(200).render('login', {
    Title: 'Mathew Maciel- Login Page',
    getMetaData
  })
}

/**
 * Handles the submission of the contact form by sending an email to both the user and the host.
 * Utilizes the `Email` class for sending emails, where emails are sent based on the request's body content.
 *
 * @param {Object} req - The request object containing the contact form's data.
 * @param {Object} res - The response object used to send a reply back to the client.
 * @param {Function} next - The next middleware function in the Express middleware chain.
 *
 * @property {string} req.body.name - The name of the person submitting the form.
 * @property {string} req.body.email - The email address of the person submitting the form.
 * @property {string} req.body.message - The message provided by the person in the contact form.
 */
exports.postContact = catchAsync(async (req, res, next) => {
  const { name, email, message, recaptcha } = req.body

  console.log(recaptcha)
  const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}&remoteip=${req.ip}`;

  const response = await fetch(verificationURL, { method: 'POST' });
  const data = await response.json();

  console.log(data)

  if (!data.success || data.score < 0.7) {
    return next(new AppError('Failed captcha verification', 400))
  }

  if (!email || !message) {
    return next(new AppError('Please provide email and message!', 400))
  }
  const url = `${req.protocol}://${req.get('host')}/`

  await new Email({ name, email, message }, url).sendWelcome()
  await new Email({ name, email: 'mathewmacielmusic@gmail.com', message }, url).sendToHost()

  res.status(200).json({ status: 'success', message: 'Email sent!' })
})

/**
 * Handles the submission of the subscriber form by saving the email to the database.
 * @param { object } req - The request object containing the subscriber's email.
 * @param { object } res - The response object used to send a reply back to the client.
 * @param { function } next - The next middleware function in the Express middleware chain.
 *
 * @property { string } req.body.email - The email address of the subscriber.
 */
exports.postSubscriber = catchAsync(async (req, res, next) => {
  const { email } = req.body
  if (!email) {
    return next(new AppError('Please provide an email!', 400))
  }
  const newSubscriber = await Subscriber.create({ email })

  res.status(200).json({
    status: 'success',
    message: 'Subscription successful!',
    data: { subscriber: newSubscriber }
  })
})

/**
 * Handles the retrieval of all subscribers from the database.
 * @param { object } req - The request object.
 * @param { object } res - The response object used to send a reply back to the client.
 * @param { function } next - The next middleware function in the Express middleware chain.
 */
exports.getSubscriber = catchAsync(async (req, res, next) => {
  const subscribers = await Subscriber.find()
  if (!subscribers) {
    return next(new AppError('No subscribers found', 404))
  }

  res.status(200).json({
    status: 'success',
    results: subscribers.length,
    data: { subscribers }
  })
})
