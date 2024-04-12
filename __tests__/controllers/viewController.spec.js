const {
  checkBodyForEmail,
  getHomePage,
  getContactPage,
  getMusicPage,
  getVideoPage,
  getBioPage,
  getAboutPage,
  getConstructionPage,
  login,
  postContact,
  postSubscriber,
  getSubscriber,
} = require("../../controllers/viewController");
const {
  GetAllMusic,
  GetFeaturedSong,
  GetFeaturedVideos,
  GetMetaData,
  GetBanners,
  GetAllVideos,
  GetBio,
  GetAbout,
} = require("../../utils/graphql");

const Email = require("../../utils/email");
const Subscriber = require("../../models/subscriber");
const fetch = require('node-fetch');

jest.mock("../../utils/catchAsync", () => jest.fn((fn) => fn));
jest.mock("../../utils/graphql");
jest.mock("../../utils/email", () => {
  return jest.fn().mockImplementation(() => {
    return { sendWelcome: jest.fn(), sendToHost: jest.fn() };
  });
});
jest.mock("../../models/subscriber");
jest.mock('node-fetch');


describe("ViewController", () => {
  let request, response, next;

  beforeEach(() => {
    request = { body: {} };
    response = {
      status: jest.fn(() => response),
      json: jest.fn(),
      render: jest.fn(),
    };
    next = jest.fn();

    // Default mock implementations
    GetAllMusic.mockResolvedValue([]);
    GetFeaturedSong.mockResolvedValue([]);
    GetFeaturedVideos.mockResolvedValue([]);
    GetMetaData.mockResolvedValue([]);
    GetBanners.mockResolvedValue({});
    GetBio.mockResolvedValue([]);
    GetAllVideos.mockResolvedValue([]);
    GetAbout.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("checkBodyForEmail Middleware", () => {
    it("returns 404 if no email in body", () => {
      checkBodyForEmail(request, response, next);

      const expectedError = new Error("Cannot find email parameter");

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    });

    it("returns 404 if email is invalid", () => {
      request.body.email = "invalidemail";
      checkBodyForEmail(request, response, next);

      const expectedError = new Error("Email is not valid");

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    });

    it("calls next if email is valid", () => {
      request.body.email = "test@test.com";
      checkBodyForEmail(request, response, next);

      expect(response.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe("getHomePage Controller", () => {
    it("renders home page with default settings", async () => {
      await getHomePage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/home",
        expect.objectContaining({
          Title: "Mathew Maciel - Home Page",
          homeBannerImage: expect.any(String),
          music: [],
          featuredSong:
            "https://open.spotify.com/embed/track/3meajb9mhHi8qIII4EHSDE",
          featuredVideo: [],
          getMetaData: [],
        })
      );
      expect(response.status).toHaveBeenCalledWith(200);
    });

    it("renders home page with a featured song", async () => {
      GetFeaturedSong.mockResolvedValue([
        { spotifyUrl: "https://open.spotify.com/embed/track/featuredSong" },
      ]);

      await getHomePage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/home",
        expect.objectContaining({
          featuredSong: "https://open.spotify.com/embed/track/featuredSong",
        })
      );
    });

    it("renders home page with default banner image if no home banner is found", async () => {
      GetBanners.mockResolvedValue({});

      await getHomePage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/home",
        expect.objectContaining({
          homeBannerImage: "/img/header/1.png",
        })
      );
    });

    it("renders home page with custom banner image if home banner is found", async () => {
      GetBanners.mockResolvedValue({
        homeBanner: { url: "/custom/banner/url.png" },
      });

      await getHomePage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/home",
        expect.objectContaining({
          homeBannerImage: "/custom/banner/url.png",
        })
      );
    });

    it("does not render home page if an error occurs", async () => {
      GetAllMusic.mockRejectedValue(new Error("error"));

      await expect(getHomePage(request, response, next)).rejects.toThrow(
        "error"
      );

      expect(response.render).not.toHaveBeenCalled();
      expect(response.status).not.toHaveBeenCalled();
    });
  });

  describe("getContactPage Controller", () => {
    it("renders contact page with default settings", async () => {
      await getContactPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/contact",
        expect.objectContaining({
          Title: "Mathew Maciel - Contact Page",
          contactBannerImage: "/img/header/7.png",
          getMetaData: [],
        })
      );
      expect(response.status).toHaveBeenCalledWith(200);
    });

    it("renders contact page with default banner image if no contact banner is found", async () => {
      GetBanners.mockResolvedValue({});

      await getContactPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/contact",
        expect.objectContaining({
          contactBannerImage: "/img/header/7.png",
        })
      );
    });

    it("renders contact page with custom banner image if contact banner is found", async () => {
      GetBanners.mockResolvedValue({
        contactBanner: { url: "/custom/banner/url.png" },
      });

      await getContactPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/contact",
        expect.objectContaining({
          contactBannerImage: "/custom/banner/url.png",
        })
      );
    });
  });

  describe("getMusicPage Controller", () => {
    it("renders music page with default settings", async () => {
      await getMusicPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/music",
        expect.objectContaining({
          Title: "Mathew Maciel - Music Page",
          music: [],
          musicBannerImage: "/img/header/5.png",
          getMetaData: [],
        })
      );
      expect(response.status).toHaveBeenCalledWith(200);
    });

    it("renders music page with default banner image if no music banner is found", async () => {
      GetBanners.mockResolvedValue({});

      await getMusicPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/music",
        expect.objectContaining({
          musicBannerImage: "/img/header/5.png",
        })
      );
    });

    it("renders music page with custom banner image if music banner is found", async () => {
      GetBanners.mockResolvedValue({
        musicBanner: { url: "/custom/banner/url.png" },
      });

      await getMusicPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/music",
        expect.objectContaining({
          musicBannerImage: "/custom/banner/url.png",
        })
      );
    });

    it("does not render music page if an error occurs", async () => {
      GetAllMusic.mockRejectedValue(new Error("error"));

      await expect(getMusicPage(request, response, next)).rejects.toThrow(
        "error"
      );

      expect(response.render).not.toHaveBeenCalled();
      expect(response.status).not.toHaveBeenCalled();
    });
  });

  describe("getVideoPage Controller", () => {
    it("renders video page with default settings", async () => {
      await getVideoPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/videos",
        expect.objectContaining({
          Title: "Mathew Maciel - Video Page",
          videos: [],
          videoBannerImage: "/img/header/6.png",
          getMetaData: [],
        })
      );
      expect(response.status).toHaveBeenCalledWith(200);
    });

    it("renders video page with default banner image if no video banner is found", async () => {
      GetBanners.mockResolvedValue({});

      await getVideoPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/videos",
        expect.objectContaining({
          videoBannerImage: "/img/header/6.png",
        })
      );
    });

    it("renders video page with custom banner image if video banner is found", async () => {
      GetBanners.mockResolvedValue({
        videoBanner: { url: "/custom/banner/url.png" },
      });

      await getVideoPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/videos",
        expect.objectContaining({
          videoBannerImage: "/custom/banner/url.png",
        })
      );
    });

    it("does not render video page if an error occurs", async () => {
      GetAllVideos.mockRejectedValue(new Error("error"));

      await expect(getVideoPage(request, response, next)).rejects.toThrow(
        "error"
      );

      expect(response.render).not.toHaveBeenCalled();
      expect(response.status).not.toHaveBeenCalled();
    });
  });

  describe("getBioPage Controller", () => {
    it("renders bio page with default settings", async () => {
      await getBioPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/bio",
        expect.objectContaining({
          Title: "Mathew Maciel - Bio Page",
          bio: [],
          bioBannerImage: "/img/header/4.png",
          getMetaData: [],
        })
      );
      expect(response.status).toHaveBeenCalledWith(200);
    });

    it("renders bio page with default banner image if no bio banner is found", async () => {
      GetBanners.mockResolvedValue({});

      await getBioPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/bio",
        expect.objectContaining({
          bioBannerImage: "/img/header/4.png",
        })
      );
    });

    it("renders bio page with custom banner image if bio banner is found", async () => {
      GetBanners.mockResolvedValue({
        bioBanner: { url: "/custom/banner/url.png" },
      });

      await getBioPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/bio",
        expect.objectContaining({
          bioBannerImage: "/custom/banner/url.png",
        })
      );
    });
  });

  describe("getAboutPage Controller", () => {
    it("renders about page with default settings", async () => {
      await getAboutPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/about",
        expect.objectContaining({
          Title: "Mathew Maciel - About Page",
          about: [],
          aboutBannerImage: "/img/header/2.png",
          getMetaData: [],
        })
      );
      expect(response.status).toHaveBeenCalledWith(200);
    });

    it("renders about page with default banner image if no about banner is found", async () => {
      GetBanners.mockResolvedValue({});

      await getAboutPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/about",
        expect.objectContaining({
          aboutBannerImage: "/img/header/2.png",
        })
      );
    });

    it("renders about page with custom banner image if about banner is found", async () => {
      GetBanners.mockResolvedValue({
        aboutBanner: { url: "/custom/banner/url.png" },
      });

      await getAboutPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/about",
        expect.objectContaining({
          aboutBannerImage: "/custom/banner/url.png",
        })
      );
    });
  });

  describe("getConstructionPage Controller", () => {
    it("renders construction page with default settings", () => {
      getConstructionPage(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "mathew/construction",
        expect.objectContaining({
          Title: "Mathew Maciel - Construction Page",
        })
      );
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe("login Controller", () => {
    it("renders login page with default settings", () => {
      login(request, response);

      expect(response.render).toHaveBeenCalledWith(
        "login",
        expect.objectContaining({
          Title: "Mathew Maciel- Login Page",
        })
      );
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('postContact Controller', () => {
    let req, res, next;
  
    beforeEach(() => {
      req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Hello!',
          recaptcha: 'valid-recaptcha-token',
        },
        protocol: 'https',
        get: jest.fn().mockReturnValue('localhost'),
        ip: '127.0.0.1',
      };
  
      res = {
        status: jest.fn().mockReturnThis(), // Mock status function to allow chaining
        json: jest.fn(),
      };
  
      next = jest.fn();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('sends an email to the host and the user if recaptcha verification is successful', async () => {
      const mockFetchResponse = {
        success: true,
        score: 0.8,
      };
  
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockFetchResponse),
      });
  
      await postContact(req, res, next);
  
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Email sent!',
      });
  
      // You can also assert on the mocked Email constructor and its methods here
    });
  
    it('calls next with an error if recaptcha verification fails', async () => {
      const mockFetchResponse = {
        success: false,
      };
  
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockFetchResponse),
      });
  
      await postContact(req, res, next);
  
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  
    it('calls next with an error if email or message is missing', async () => {
      req.body = { name: 'Test User', email: '', message: 'Hello!' };
  
      await postContact(req, res, next);
  
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("postSubscriber Controller", () => {
    it("sends an email to the host and the user", async () => {
      request.body = { email: "test@example.com" };
      Subscriber.create.mockResolvedValue({ email: "test@example.com" });

      await postSubscriber(request, response, next);

      expect(Subscriber.create).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        status: "success",
        message: "Subscription successful!",
        data: { subscriber: expect.any(Object) },
      });
    });

    it("calls next with an error if email is missing", async () => {
      request.body = { email: "" };

      await postSubscriber(request, response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getSubscriber Controller", () => {
    it("retrieves all subscribers from the database", async () => {
      const subscribers = [
        { email: "user1WithEmail.com" },
        { email: "user2WithEmail.com" },
      ];

      Subscriber.find.mockResolvedValue(subscribers);

      await getSubscriber(request, response, next);

      expect(Subscriber.find).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        results: subscribers.length,
        status: "success",
        data: { subscribers },
      });
    });

    it("calls next with an error if no subscribers are found", async () => {
      Subscriber.find.mockResolvedValue(null);

      await getSubscriber(request, response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
