async function AdminOnload()
{
    ReplaceWithSidebarMenuAdmin();
    ReplaceWithAdminMainPage();
}
document.onloadevents.push(AdminOnload);