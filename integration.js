import http from "k6/http";
import { check } from "k6";

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
    });
}
