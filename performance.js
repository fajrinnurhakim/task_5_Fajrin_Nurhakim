import http from "k6/http";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    vus: 1000,
    iterations: 3500,
    thresholds: {
        http_req_duration: ["p(95)<2000"],
    },
};

export default function () {
    const base_url = "https://reqres.in/api";
    const path_url = "/users";
    const path_url2 = "/users/2";

    // Scenario Test 1: Create User API - Method POST
    const createPayload = JSON.stringify({
        name: "morpheus",
        job: "leader",
    });
    const createParams = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const createResponse = http.post(
        `${base_url}${path_url}`,
        createPayload,
        createParams
    );
    check(createResponse, {
        "Create User - response code was 201": (createResponse) =>
            createResponse.status == 201,
        "Create User - response time is less than 2000ms": (createResponse) =>
            createResponse.timings.duration < 2000,
        "Post response name is correct": (createResponse) => {
            const responseBody = JSON.parse(createResponse.body);
            return responseBody.name === "morpheus";
        },
        "Post response job is correct": (createResponse) => {
            const responseBody = JSON.parse(createResponse.body);
            return responseBody.job === "leader";
        },
    });

    // Scenario Test 2: API Update - Method PUT
    const updatePayload = JSON.stringify({
        name: "morpheus",
        job: "zion resident",
    });
    const updateParams = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const updateResponse = http.put(
        `${base_url}${path_url2}`,
        updatePayload,
        updateParams
    );
    check(updateResponse, {
        "Update User - response code was 200": (updateResponse) =>
            updateResponse.status == 200,
        "Update User - response time is less than 2000ms": (updateResponse) =>
            updateResponse.timings.duration < 2000,
        "Update response name is correct": (updateResponse) => {
            const responseBody = JSON.parse(updateResponse.body);
            return responseBody.name === "morpheus";
        },
        "Update response job is correct": (updateResponse) => {
            const responseBody = JSON.parse(updateResponse.body);
            return responseBody.job === "zion resident";
        },
    });
}

export function handleSummary(data) {
    return {
        "visualReport.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}
