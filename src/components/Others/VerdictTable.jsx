import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerdictTable({ status, info }) {
    const [submissionList, setSubmissionList] = useState([]);
    const { judge, problemID } = info;
    const navigate = useNavigate();

    const handleRequestError = (error) => {
        console.log(error);
        navigate("/server-error");
    };

    const getSubmission = async () => {
        try {
            const { data } = await axios.post(
                "/api/submissiondata/specific-problem",
                {
                    judge,
                    problemID,
                }
            );

            if (data.status === undefined) {

                data.reverse();
                setSubmissionList((prevList) => [...data, ...prevList]);
            } else {
                console.log(data.error);
                navigate("/server-error");
            }
        } catch (error) {
            handleRequestError(error);
        }
    };

    useEffect(() => {
        const abortController = new AbortController();
        getSubmission();

        return () => {
            abortController.abort();
            setSubmissionList([]);
        };
    }, []);

    useEffect(() => {
        status !== undefined
            ? status.status === undefined
                ? setSubmissionList((prevList) => [status, ...prevList])
                : (console.log(status.message), navigate("/server-error"))
            : null;
    }, [status]);

    return (
        <div className="overflow-x-auto mb-5">
            <table className="border border-gray-300 w-full">
                <thead>
                    <tr>
                        <th className="border-b px-4 py-2">Submission</th>
                        <th className="border-b px-4 py-2">Time</th>
                        <th className="border-b px-4 py-2">Verdict</th>
                    </tr>
                </thead>
                <tbody>
                    {submissionList.map((status) => (
                        <tr key={status._id}>
                            <td className="border-b px-4 py-2 text-center">
                                {status.realJudgesSubmissionID}
                            </td>
                            <td className="border-b px-4 py-2 text-center">
                                {status.submitDate}
                                <br />
                                {status.submitTime}
                            </td>
                            <td
                                className={`border-b px-4 py-2 text-center ${
                                    status.verdict === "Accepted"
                                        ? "font-bold text-green-500"
                                        : "text-red-500"
                                }`}
                            >
                                {status.verdict}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
