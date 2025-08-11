type ParticipantsProps = {
    participants: User[];
}

const Participants = (props: ParticipantsProps) => {
    const { participants } = props;
    return (
        <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 text-white">
        <span className="font-semibold text-sm">Participants:</span>
        {participants.map((user, idx) => (
          <div
            key={`participant-${idx}`}
            className="bg-blue-700 text-white text-xs px-2 py-1 rounded-full"
          >
            {user.name}
          </div>
        ))}
      </div>
    )
}

export default Participants;