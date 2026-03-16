export default function StatCard({ title, value, subtitle, icon: Icon, trend }) {
  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-muted-foreground font-medium text-sm mb-1">{title}</h3>
          <div className="text-3xl font-bold text-foreground">{value}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {subtitle && (
        <div className="flex items-center text-sm relative z-10">
          <span className={`font-medium ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
            {subtitle}
          </span>
        </div>
      )}
      
      {/* Decorative background element */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
    </div>
  );
}
