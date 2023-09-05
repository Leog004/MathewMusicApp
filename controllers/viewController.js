const express = require('express');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const Subscriber = require('../models/subscriber');
const { GetAllMusic, GetFeaturedSong, GetAllVideos, GetBio, GetAbout, GetFeaturedVideos, GetMetaData, GetBanners } = require('../utils/graphql');



exports.checkBodyForEmail = (req, res, next) =>  {

    if(!req.body.email){
        return res.status(404).json({
            status: 'fail',
            message: 'Can not find parameter name'
        });
    }

    next();
}


exports.getHomePage = catchAsync ( async (req, res) => {
    const music = await GetAllMusic();
    const featuredSong = await GetFeaturedSong();
    const featuredVideo = await GetFeaturedVideos();
    const getMetaData = await GetMetaData();
    const getHomeBanner = await GetBanners();

    const homeBannerImage = (getHomeBanner?.homeBanner?.url) || '/img/header/1.png';

    let featuredSongPlay = 'https://open.spotify.com/embed/track/3meajb9mhHi8qIII4EHSDE';

    if(featuredSong.length > 0) {
        featuredSongPlay = featuredSong[0].spotifyUrl;
        console.log(featuredSongPlay);
    }

    
    res.status(200).render('mathew/home', {
        Title: 'Mathew Maciel - Home Page',
        music,
        featuredSong: featuredSongPlay,
        featuredVideo,
        getMetaData,
        homeBannerImage: homeBannerImage
    });
});

exports.getContactPage = async (req, res) => {
    const getContactBanner = await GetBanners();
    const getMetaData = await GetMetaData();
    const contactBannerImage = (getContactBanner?.contactBanner?.url) || '/img/header/7.png';

    res.status(200).render('mathew/contact',{
        Title: 'Mathew Maciel - Contact Page',
        getMetaData,
        contactBannerImage: contactBannerImage
    });
}

exports.getMusicPage = catchAsync ( async (req, res) => {
    const music = await GetAllMusic();
    const getMetaData = await GetMetaData();
    const getMusicBanner = await GetBanners();
    const musicBannerImage = (getMusicBanner?.musicBanner?.url) || '/img/header/5.png';


    res.status(200).render('mathew/music',{
        Title: 'Mathew Maciel - Music Page',
        music,
        getMetaData,
        musicBannerImage: musicBannerImage,
    });  
});

exports.getVideoPage = catchAsync ( async (req, res) => {
    
    const videos = await GetAllVideos();
    const getMetaData = await GetMetaData();
    const getVideoBanner = await GetBanners();
    const videoBannerImage = (getVideoBanner?.videoBanner?.url) || '/img/header/6.png';

    res.status(200).render('mathew/videos',{
        Title: 'Mathew Maciel - Video Page',
        videos,
        getMetaData,
        videoBannerImage: videoBannerImage
    });
});

exports.getBioPage = catchAsync ( async (req, res) => {
    const bio = await GetBio();
    const getMetaData = await GetMetaData();
    const getBioBanner = await GetBanners();
    const bioBannerImage = (getBioBanner?.bioBanner?.url) || '/img/header/4.png';

    res.status(200).render('mathew/bio',{
        Title: 'Mathew Maciel - Bio Page',
        bio,
        getMetaData,
        bioBannerImage: bioBannerImage
    });
});

exports.getAboutPage = catchAsync ( async (req, res) => {
    const about = await GetAbout();
    const getMetaData = await GetMetaData();
    const getAboutBanner = await GetBanners();
    const aboutBannerImage = (getAboutBanner?.aboutBanner?.url) || '/img/header/2.png';

    res.status(200).render('mathew/about',{
        Title: 'Mathew Maciel - About Page',
        about,
        getMetaData,
        aboutBannerImage: aboutBannerImage
    });
});


exports.getConstructionPage = (req, res) => {
    res.status(200).render('mathew/construction',{
        Title: 'Mathew Maciel - Construction Page'
    });  
}


exports.login = (req, res) => {
    res.status(200).render('login',{
        Title: 'Mathew Maciel- Login Page'
    });  
}


exports.postContact = catchAsync( async (req, res) => {

    const {name, email, message} = req.body;

    // Check if email exists
    if(!email || !message){
        return next(new AppError('Please provide email and message!', 400));
    }

    const newContact = await {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message       
    };

    const toHost = await {
        name: req.body.name,
        email: 'mathewmacielmusic@gmail.com',
        userEmail: req.body.email,
        message: req.body.message       
    };

      const url = `${req.protocol}://${req.get('host')}/`;
      await new Email(newContact, url).sendWelcome();
      await new Email(toHost, url).sendToHost();

      res.status(200).json({
        status: 'success',
        message: 'email sent!'
      });

});


exports.postSubscriber = catchAsync( async(req, res) => {

    const email = req.body.email;
    console.log(req.body);

    // Check if email exists
    if(!email){
        return next(new AppError('Please provide email and message!', 400));
    }

    const newSubscriber = await Subscriber.create(req.body);

    // const toHost_ = await {
    //     email: 'mathewmacielmusic@gmail.com',
    //     userEmail: req.body.email
    // };

    // const url = `${req.protocol}://${req.get('host')}/`;
    // await new Email(toHost_, url).sendToHostSubscriber();

    res.status(200).json({
        status: 'success',
        message: 'email sent!',
        data:{ 
            subscriber: newSubscriber
        }
      });

});


exports.getSubscriber = catchAsync(async(req, res) => {

    const subscribers = await Subscriber.find();

    if(!subscribers){
        return next(new AppError('Can not find any subscribers', 404));
    }

    res.status(200).json({
        status: 'success',
        results : subscribers.length,
        data: subscribers
    })

});
