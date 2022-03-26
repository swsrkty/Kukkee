import { Form } from "react-bootstrap";
import { Dispatch, useState } from "react";
import { Time, Vote } from "../../models/poll";

const MarkTimesProtected = (props: {
  username: string;
  times: Time[];
  newVote: Vote;
  setNewVote: Dispatch<Vote>;
}): JSX.Element => {
  const { username, times, newVote, setNewVote } = props;

  const [ifNeedBeHidden, setIfNeedBeHidden] = useState<Record<number, boolean>>(
    {}
  );

  const [ifNeedBe, setIfNeedBe] = useState<Record<number, boolean>>({});

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { dataset, checked } = e.target;
    const time: Time = dataset.value ? JSON.parse(dataset.value) : {};
    let newTimes = newVote.times;
    if (checked) {
      setIfNeedBeHidden((prev) => ({ ...prev, [time.start]: true }));
      time.ifNeedBe = ifNeedBe[time.start];
      newTimes.push(time);
      setNewVote({ username, times: newTimes });
    } else {
      setIfNeedBeHidden((prev) => ({ ...prev, [time.start]: false }));
      newTimes = newTimes.filter((item) => item.start !== time.start);
      setNewVote({ username, times: newTimes });
    }
  };

  const handleIfNeedBeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { dataset, checked } = e.target;
    let time: Time = dataset.value ? JSON.parse(dataset.value) : {};
    let newTimes = newVote.times;
    if (checked) {
      setIfNeedBe((prev) => ({ ...prev, [time.start]: true }));
      newTimes = newTimes.filter((item) => item.start !== time.start);
      time.ifNeedBe = true;
      newTimes.push(time);
      setNewVote({ username, times: newTimes });
    } else {
      setIfNeedBe((prev) => ({ ...prev, [time.start]: false }));
      newTimes = newTimes.filter((item) => item.start !== time.start);
      time.ifNeedBe = false;
      newTimes.push(time);
      setNewVote({ username, times: newTimes });
    }
  };
  return (
    <tr>
      <td className="poll-table-choose-textbox">
        <Form.Control
          className="mark-time-name protected"
          type="text"
          placeholder="Your name"
          value={username}
          disabled
        />
      </td>
      {times.map((time) => (
        <td key={time.start} className="slot-checkbox-cell">
          <Form.Check
            data-value={JSON.stringify(time)}
            className="slot-checkbox"
            onChange={handleTimeChange}
          />

          <Form.Check
            data-value={JSON.stringify(time)}
            className="if-need-be-checkbox"
            hidden={!ifNeedBeHidden[time.start]}
            onChange={handleIfNeedBeChange}
          />
        </td>
      ))}
    </tr>
  );
};

export default MarkTimesProtected;
