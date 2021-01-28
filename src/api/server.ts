import { RocketMeetPoll, Vote, HttpResponse, Choice } from "../models/poll";

class ServerAPI {
  headers: Headers | string[][] | Record<string, string> | undefined;

  URL: string | undefined;

  domain: string | undefined;

  constructor() {
    // Figure out a way to access store
    // https://github.com/kirill-konshin/next-redux-wrapper/issues/214#issuecomment-680273330

    this.URL = process.env.NEXT_PUBLIC_SERVER_URL;
    this.domain = process.env.NEXT_PUBLIC_ORIGIN_DOMAIN;
  }

  httpMethod = async (
    endpoint: string,
    reqMethod: string,
    token = "",
    payload = ""
  ): Promise<HttpResponse> => {
    this.headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": `${this.domain}`,
      Authorization: `Bearer ${token}`,
    };
    const requestOptions: RequestInit = {
      method: reqMethod,
      headers: this.headers,
    };
    if (reqMethod !== "GET") {
      requestOptions.body = payload;
    }
    const res = await fetch(endpoint, requestOptions);
    const { status } = res;
    const responseData = await res.json();
    return {
      data: responseData,
      statusCode: status,
    };
  };

  getPoll = (pollid: string | string[] | null | undefined): Promise<HttpResponse> => {
    const endpoint = `${this.URL}/poll/${pollid}`;
    return this.httpMethod(endpoint, "GET");
  };

  getPolls = (pollArgs: {
    userID: string;
    token: string;
  }): Promise<HttpResponse> => {
    const { userID, token } = pollArgs;
    const endpoint = `${this.URL}/user/${userID}`;
    return this.httpMethod(endpoint, "GET", token);
  };

  createPoll = (pollArgs: {
    poll: RocketMeetPoll;
    token: string;
  }): Promise<HttpResponse> => {
    const { poll, token } = pollArgs;
    const payload = JSON.stringify(poll);
    const endpoint = `${this.URL}/user/poll`;
    return this.httpMethod(endpoint, "POST", token, payload);
  };

  markChoices = (voteArgs: {
    newVote: Vote;
    pollid: string;
    token: string;
  }): Promise<HttpResponse> => {
    const { newVote, pollid, token } = voteArgs;
    const payload = JSON.stringify(newVote);
    const endpoint = `${this.URL}/poll/${pollid}`;
    return this.httpMethod(endpoint, "PUT", token, payload);
  };

  markFinalChoice = (voteArgs: {
    finalChoice: Choice;
    pollid: string;
    token: string;
  }): Promise<HttpResponse> => {
    const { finalChoice, pollid, token } = voteArgs;
    const payload = JSON.stringify(finalChoice);
    const endpoint = `${this.URL}/user/poll/${pollid}`;
    return this.httpMethod(endpoint, "PUT", token, payload);
  };
}

export const serverAPI = new ServerAPI();
