export default function FilmCard({ film }) {
  return (
    <div className="min-w-[180px] w-[180px] bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
      
      <img
        src={film.thumbnail || "/placeholder.jpg"}
        alt={film.title}
        className="w-full h-[260px] object-cover"
      />

      <div className="p-2">
        <h3 className="text-sm font-semibold text-white truncate">
          {film.title}
        </h3>
      </div>
    </div>
  );
}